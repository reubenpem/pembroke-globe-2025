const locationPath = location.pathname.replace(/\/[^\/]+$/, "");

var dojoConfig = {
    packages: [{
        name: "utils",
        location: locationPath + "utils"
    }],
    async: true
};