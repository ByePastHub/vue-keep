import { KEEP_COMPONENT_DESTROY } from './constants';

async function destroy(value) {
  const destroyEvent = new CustomEvent(KEEP_COMPONENT_DESTROY, { detail: value });
  window.dispatchEvent(destroyEvent);
}

export {
  destroy
};
