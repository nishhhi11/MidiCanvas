import MidiWorker from "../workers/midi.worker.js?worker";

export function parseMidi(file) {
  return new Promise(async (resolve, reject) => {
    const buffer = await file.arrayBuffer();
    const worker = new MidiWorker();

    worker.onmessage = (e) => {
      const { success, parsed, error } = e.data;
      if (success) {
        resolve(parsed);
      } else {
        reject(new Error(error));
      }
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    worker.postMessage({ buffer, name: file.name }, [buffer]);
  });
}
