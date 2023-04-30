export interface Stats {
  startStamp: number;
  lastStamp: number;
  retryTime: number;
  nextClickTime: number;
  clickRetryTime: number;
  clickCount: number;
}
declare global {
  let timestamp: ((...args: any[]) => number) & Stats;
}

/**
 * Initialize the profiling timers.
 *
 * Run this code as close to beginning of HTML as possible.
 */
export async function start() {
  timestamp = function (...args: any[]) {
    const time = new Date().getTime() - timestamp.startStamp;
    if (args.length) {
      log(lpad(time - timestamp.lastStamp), "ms", lpad(time), "ms", ...args);
      timestamp.lastStamp = time;
    }
    return time;
  } as any;

  Object.assign(timestamp, {
    startStamp: new Date().getTime(),
    lastStamp: 0,
    retryTime: 5,
    nextClickTime: 0,
    clickRetryTime: 500,
    clickCount: 0,
  } satisfies Stats);
  timestamp("Start of <HTML> received, starting timers.");

  timestamp("Looking for interaction button");
  const button1 = await selector("#interaction-button-1");
  const coldStamp = timestamp("Found button:" + button1.id);
  let coldEventDelay = 0;
  let coldRenderDelay = 0;
  let response: Element | null = null;
  do {
    timestamp("Cold start: CLICK");
    button1.dispatchEvent(
      new CustomEvent("click", {
        detail: () =>
          (coldEventDelay = timestamp("processing CLICK Event") - coldStamp),
      })
    );
    try {
      response = await selector("#interaction-rendering-1", 300);
      coldRenderDelay =
        timestamp("UI updated as a response to CLICK") -
        coldEventDelay -
        coldStamp;
    } catch {
      timestamp("retry....");
    }
  } while (!response);

  const button2 = await selector("#interaction-button-2");
  const warmStamp = timestamp("Warm start: CLICK");
  let warmEventDelay = 0;
  let warmRenderDelay = 0;
  button2.dispatchEvent(
    new CustomEvent(
      "click",
      new CustomEvent("click", {
        detail: () =>
          (warmEventDelay = timestamp("processing CLICK Event") - warmStamp),
      })
    )
  );
  await selector("#interaction-rendering-2");
  warmRenderDelay =
    timestamp("UI updated as a response to CLICK") - warmEventDelay - warmStamp;

  log("------ DONE ------");
  const stateScript = await selector('script[type="qwik/json"]');
  const state = JSON.stringify(JSON.parse(stateScript.textContent!));
  log("Size of serialized state:", state.length, "bytes");
  log("Cold delay:", coldRenderDelay + coldRenderDelay, "ms");
  log(lpad(coldEventDelay), "ms", "download + parse + resume cost");
  log(lpad(coldRenderDelay), "ms", "render cost");
  log("Warm delay:", warmRenderDelay + warmRenderDelay, "ms");
  log(lpad(warmEventDelay), "ms", "event propagation cost");
  log(lpad(warmRenderDelay), "ms", "render cost");

  function log(...msg: any[]) {
    console.log(...msg);
    const pre = document.querySelector("#consoleLog");
    pre && (pre.textContent += msg.join(" ") + "\n");
  }

  async function selector(selector: string, timeout: number = 5000) {
    return new Promise<Element>((res, rej) => {
      const start = new Date().getTime();
      function check() {
        const element = document.querySelector(selector);
        if (element) {
          res(element);
        } else if (start + timeout < new Date().getTime()) {
          rej("Can't find selector: " + selector);
        } else {
          requestIdleCallback(check);
        }
      }
      check();
    });
  }

  function lpad(value: any): string {
    value = String(value);
    return "     ".substring(value.length) + value;
  }
}

export function end() {
  timestamp("End of </HTML> received:");
}
