import { FormikGuard } from "./FormikGuard";
import { useHistory } from "react-router-dom";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type Callback = (...callbackArgs: any) => void;

const defaultCallback = (cb: Callback) => cb;

/**
 * Hook from unexpected reset
 * @returns {(cb: Callback) => Callback} protectFrom - wrapper for form-resetting functions
 * @returns {() => ReactElement} render - render modal inside form
 */

export const useFormikGuard = () => {
  const [editMode, setEditMode] = useState(false);
  const [callback, setCallback] = useState<Callback | undefined>(undefined);

  const clearCallback = useCallback(() => setCallback(undefined), []);

  const callbackSetter = useCallback(
    (cb: Callback) => (...callbackArgs: any) =>
      setCallback(() => {
        return () => {
          cb(...callbackArgs);
          clearCallback();
        };
      }),
    [clearCallback]
  );

  useEffect(() => {
    return () => {
      setEditMode(false);
      clearCallback();
    };
  }, [clearCallback]);

  const history = useHistory();
  const unblock = useRef<Callback | undefined>();

  const onReload = useCallback((e) => {
    e.preventDefault();
    e.returnValue = "";
  }, []);

  const onHistoryBlock = useCallback(
    () =>
      history.block((location) => {
        setCallback(() => () => {
          unblock.current?.();
          history.push(location.pathname);
        });
        return false;
      }),
    [history]
  );

  useEffect(() => {
    if (editMode) {
      unblock.current = onHistoryBlock();
      window.addEventListener("beforeunload", onReload);
    }

    return () => {
      unblock.current?.();
      window.removeEventListener("beforeunload", onReload);
    };
  }, [editMode, onHistoryBlock, onReload]);

  const protectFrom = useMemo(
    () => (editMode ? callbackSetter : defaultCallback),
    [editMode, callbackSetter]
  );

  const render = useCallback(
    () => createElement(FormikGuard, { callback, clearCallback, setEditMode }),
    [callback, clearCallback]
  );

  return { protectFrom, render };
};
