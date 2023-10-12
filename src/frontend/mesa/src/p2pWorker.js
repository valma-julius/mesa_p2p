console.log("HELLO WORLD LOL")

onmessage = function(e) {
    const result = e.data[0] + e.data[1];
    console.log("HELLO FROM THE OTHER SIDE")
    console.log(result)
    postMessage(result);
}
