import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppState } from "../contexts/app-state-context";

const useWarnUnsavedChange = (dirty: boolean, onFinished?: () => void) => {
  const { events } = useRouter();
  const { dispatch, state } = useAppState();
  const [status, setStatus] = useState<"editing" | "finished">("editing");

  useEffect(() => {
    dispatch({ type: "setIsEditing", payload: dirty });
  }, [dirty]);

  const warningText = "You have unsaved changes - are you sure you wish to leave this page?";

  const handleWindowClose = (e: BeforeUnloadEvent) => {
    if (!dirty || status === "finished") return;
    e.preventDefault();
    return (e.returnValue = warningText);
  };

  const handleBrowseAway = () => {
    if (!dirty || status === "finished") return;
    if (window.confirm(warningText)) return;
    events.emit("routeChangeError");
    throw "routeChange aborted.";
  };

  const finishEditing = () => {
    dispatch({ type: "setIsEditing", payload: false });
    setStatus("finished");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowClose);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      events.off("routeChangeStart", handleBrowseAway);
    };
  }, [state.isEditing]);

  useEffect(() => {
    console.log(state.isEditing);
    if (status === "finished" && !state.isEditing) if (onFinished) onFinished();
  }, [status]);

  return { finishEditing };
};

export default useWarnUnsavedChange;
