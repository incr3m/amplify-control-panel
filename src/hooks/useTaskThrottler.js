import React, { createProvider, useGlobal } from "reactn";
import Promise from "bluebird";
import nanoid from "nanoid";
import { useSnackbar } from "notistack";

const TaskThrottlerProvider = createProvider({
  queue: [],
  ticks: -1
  // idMap: {}
});

let taskPollerCount = 0;

function PollerInfo() {
  const [queue] = TaskThrottlerProvider.useGlobal("queue");
  const [resourceMap] = useGlobal("resourceMap");
  const resourceSize = Object.keys(resourceMap || {}).length;
  return (
    <span>
      Loading resources {resourceSize - queue.length}/{resourceSize}
    </span>
  );
}

export function useTaskPollerActions() {
  return {
    clear() {
      TaskThrottlerProvider.setGlobal({
        queue: []
      });
    }
  };
}

export function TaskPoller({ throttle = 1000 }) {
  if (taskPollerCount > 1) throw new Error("Task Poller Should be unique");

  const [{ showSnackbar }, setState] = React.useState({ showSnackbar: false });
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [ticks, setTicks] = TaskThrottlerProvider.useGlobal("ticks");
  const [queue] = TaskThrottlerProvider.useGlobal("queue");

  React.useEffect(() => {
    let snackBar;
    if (showSnackbar) {
      snackBar = enqueueSnackbar(<PollerInfo />, {
        persist: true,
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      });
    }
    return () => {
      if (showSnackbar) closeSnackbar(snackBar);
    };
  }, [showSnackbar]);

  React.useEffect(() => {
    setState(oldState => ({ ...oldState, showSnackbar: queue.length > 0 }));
  }, [queue.length]);

  React.useEffect(() => {
    if (queue.length > 0 && ticks < 0) {
      setTicks(0);
    }
  }, [queue, ticks, setTicks]);

  React.useEffect(() => {
    const queue = TaskThrottlerProvider.getGlobal().queue;
    if (ticks < 0) return;
    if (queue.length > 0) {
      Promise.delay(throttle).then(() => {
        setTicks(ticks + 1);
      });
    } else {
      Promise.delay(throttle).then(() => setTicks(-1));
    }
  }, [ticks, setTicks, throttle]);

  React.useEffect(() => {
    taskPollerCount++;
    return () => {
      taskPollerCount--;
    };
  }, []);
  return null;
}

export default function useTaskThrottler({ task }) {
  const [{ id, called, fetching, waiting, result }, setState] = React.useState({
    id: nanoid(),
    called: false,
    fetching: false,
    waiting: true,
    result: null
  });

  const [ticks] = TaskThrottlerProvider.useGlobal("ticks");
  const [throttle] = TaskThrottlerProvider.useGlobal("throttle");

  React.useEffect(() => {
    if (!task || called || fetching) return;
    const oldQTmp1 = TaskThrottlerProvider.getGlobal().queue;
    let q = oldQTmp1;
    let pos = q.findIndex(itm => itm === id);

    if (pos < 0) {
      q = [...oldQTmp1, id];
      TaskThrottlerProvider.setGlobal({
        queue: q
      });
      pos = q.length - 1;
    }

    if (pos === 0) {
      setState(oldState => ({ ...oldState, fetching: true }));
      (async () => {
        let result;
        await Promise.delay(throttle);
        try {
          result = await Promise.resolve(task);
        } catch (err) {
          console.error(">>hooks/useTaskThrottler::", "err", err); //TRACE
          result = err;
        }
        const oldQTmp = TaskThrottlerProvider.getGlobal().queue;
        const oldQ = [...oldQTmp];
        const thisIndex = oldQ.findIndex(itm => itm === id);
        oldQ.splice(thisIndex, 1);
        TaskThrottlerProvider.setGlobal({
          queue: oldQ
        });
        setState(oldState => ({
          ...oldState,
          result,
          fetching: false,
          waiting: false,
          called: true
        }));
      })();
    }
  }, [id, task, called, ticks, fetching, throttle]);

  const rerun = React.useCallback(() => {}, []);

  return {
    called,
    result,
    waiting,
    rerun
  };
}
