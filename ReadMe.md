# Coportal

## Server

https://jmrsquared.com/api/coportal/dev/

## Client

https://coportal.net/demo/


## Hints

> Alerts
 ```
  this.feedback.successs({
    title: "Thumbs up!",
    message: "Custom colors and icon. Loaded from the App_Resources folder.",
    duration: 3000,
    onTap: () => console.log("showCustomIcon tapped"),
    onShow: animating => console.log(animating ? "showCustomIcon animating" : "showCustomIcon shown"),
    onHide: () => console.log("showCustomIcon hidden")
  });
 ```

 ```
  this.feedback.error({
    title: "Thumbs up!",
    message: "Custom colors and icon. Loaded from the App_Resources folder.",
    duration: 3000,
    onTap: () => console.log("showCustomIcon tapped"),
    onShow: animating => console.log(animating ? "showCustomIcon animating" : "showCustomIcon shown"),
    onHide: () => console.log("showCustomIcon hidden")
  });
 ```
