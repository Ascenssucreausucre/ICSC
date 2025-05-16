import { useEffect } from "react";
import { useNavigation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

export default function NavigationProgress() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading") {
      console.log("Loading bar");
      NProgress.start();
    } else {
      console.log("No more loading bar");
      NProgress.done();
    }
  }, [navigation.state]);

  return null;
}
