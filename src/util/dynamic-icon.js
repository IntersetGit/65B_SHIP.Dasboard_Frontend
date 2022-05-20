
async function CreateIcon(color = "red", type = "warning") {

    const drawer = new Promise(async (resolve, reject) => {
        var canvas = document.createElement("canvas");
        canvas.id = "canvas";
        canvas.width = 300;
        canvas.height = 300;
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        var imgicon = {
            warning:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/2048px-Antu_dialog-warning.svg.png",
            warningGas:
                "https://cdn0.iconfinder.com/data/icons/hazard-warning-signs-42-high-quality-hazard-symb-1/283/gas_mask-512.png",
            warningWork:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/OOjs_UI_icon_alert-warning.svg/1200px-OOjs_UI_icon_alert-warning.svg.png",
            warningWorkIm:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1VIaG7eqsvwCbV2YVYjbqkV9irGB44VuHKQ&usqp=CAU"
        };
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

        const image = new Image();

        image.crossOrigin = "anonymous";
        image.onload = async () => {
            await ctx.save();
            await ctx.beginPath();
            ctx.globalCompositeOperation = ct[0];
            ctx.fillStyle = "#FFF";
            /* ctx.arc(150, 150, 130, 0, Math.PI * 2, false) */
            await ctx.arc(200, 60, 100 /*50*/, 0, 2 * Math.PI);
            ctx.strokeStyle = "#FFF";
            //ctx.stroke()
            await ctx.clip();
            //ctx.fill();
            /* ctx.drawImage(image, 50, -50,300,300) */
            await ctx.drawImage(image, canvas.width / 2, 0, 100, 110);
            // ctx.restore();
            resolve();
        };
        image.src = imgicon[type];

        /*
   ctx.beginPath();
   ctx.globalCompositeOperation = ct[9];
   ctx.fillStyle = "#FFF";
   ctx.arc(200,60,50,0,2*Math.PI);
   ctx.fill();   */

        await ctx.beginPath();
        ctx.globalCompositeOperation = ct[4];
        ctx.fillStyle = color;
        await ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
        await ctx.fill();

        await ctx.beginPath();
        ctx.globalCompositeOperation = ct[4];
        await ctx.rect(0, 0, 300, 300);
        ctx.fillStyle = "#000";
        // ctx.fill();
    });

    return drawer.then(async () => {
        var canvas = document.querySelector("#canvas");
        var dataURL = await canvas.toDataURL("image/jpeg", 2.0);
        return dataURL;
    });
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
    DownloadIcon
}