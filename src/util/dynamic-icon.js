var imgicon = {
  none: "",
  warning:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/2048px-Antu_dialog-warning.svg.png",
  warningGas:
    "https://cdn0.iconfinder.com/data/icons/hazard-warning-signs-42-high-quality-hazard-symb-1/283/gas_mask-512.png",
  warningWork:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/OOjs_UI_icon_alert-warning.svg/1200px-OOjs_UI_icon_alert-warning.svg.png",
  warningWorkIm:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1VIaG7eqsvwCbV2YVYjbqkV9irGB44VuHKQ&usqp=CAU"
};

function CreateIcon(color = "red", type = false, isdraw = 1) {
  const drawer = new Promise((resolve, reject) => {
    var element = document.getElementById("canvas");
    if (element) {
      element.remove();
    }
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.style.display = "none";
    canvas.width = 210;
    canvas.height = 210;
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var ct = [
      "source-over", //  0
      "source-in", //  1
      "source-out", //  2
      "source-atop", //  3
      "destination-over", //  4
      "destination-in", //  5
      "destination-out", //  6
      "destination-atop", //  7
      "lighter", //  8
      "darker", //  9
      "copy", // 10
      "xor" // 11
    ];
    if (type) {
      const image = new Image();

      image.crossOrigin = "anonymous";
      image.onload = async () => {
        await ctx.save();
        await ctx.beginPath();
        ctx.globalCompositeOperation = ct[0];
        ctx.fillStyle = "#FFF";
        /* ctx.arc(150, 150, 130, 0, Math.PI * 2, false) */
        await ctx.arc(200, 80, 100 /*50*/, 0, 2 * Math.PI);
        ctx.strokeStyle = "#FFF";
        //ctx.stroke()
        await ctx.clip();
        //ctx.fill();
        /* ctx.drawImage(image, 50, -50,300,300) */
        await ctx.drawImage(image, canvas.width / 2, 10, 100, 110);
        // ctx.restore();
        resolve();
      };
      image.src = imgicon[type];
    } else {
      resolve();
    }
    // ctx.beginPath();
    // ctx.globalCompositeOperation = ct[9];
    // ctx.fillStyle = "#FFF";
    // ctx.arc(200, 60, 50, 0, 2 * Math.PI);
    // ctx.fill();

    ctx.beginPath();
    ctx.globalCompositeOperation = ct[4];
    ctx.fillStyle = color;
    ctx.strokeStyle = "#000000";
    if (isdraw == 1) {
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
    } else {
      ctx.fillRect(20, 20, canvas.width, canvas.height);
      ctx.strokeRect(20, 20, canvas.width, canvas.height);
    }
    ctx.fill();
    ctx.stroke();

    // ctx.beginPath();
    // ctx.globalCompositeOperation = ct[4];
    // ctx.rect(0, 0, 300, 300);
    // ctx.fillStyle = "#000";
    // ctx.fill();
  });

  return drawer.then(async () => {
    var canvas = document.querySelector("#canvas");
    var dataURL = await canvas.toDataURL("image/png", 2.0);
    return dataURL;
  });
}

async function CreateImgIcon(
  img = "https://cdn-icons-png.flaticon.com/512/2554/2554936.png",
  type = false
) {
  var element = document.getElementById("canvas");
  if (element) {
    element.remove();
  }
  var canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.style.display = "none";
  canvas.width = 210;
  canvas.height = 210;
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  if (type) {
    const drawer1 = () => new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = async () => {
        await ctx.save();
        await ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
        await ctx.arc(200, 80, 100, 0, 2 * Math.PI);
        await ctx.drawImage(image, canvas.width / 2, 0, 100, 110);
        resolve();
      };
      image.src = imgicon[type];
    });
    await drawer1()
  }

  const drawer2 = () => new Promise((resolve, reject) => {
    const image2 = new Image();
    image2.crossOrigin = "anonymous";
    image2.onload = async () => {
      await ctx.save();
      await ctx.beginPath();
      ctx.globalCompositeOperation = "destination-over";
      await ctx.rect(0, 0, 300, 300);
      await ctx.clip();
      await ctx.drawImage(image2, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    image2.src = img;
  });
  await drawer2();

  var dataURL = canvas.toDataURL("image/png", 2.0);
  console.log(dataURL)
  return dataURL;
}

async function DownloadIcon(
  color = "red",
  type = "warning",
  filename = "untitled.png"
) {
  const dataimage = await CreateIcon("orange", "warningGas");
  var a = document.createElement("a");
  a.href = dataimage;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}

export {
  CreateIcon,
  CreateImgIcon,
  DownloadIcon
}