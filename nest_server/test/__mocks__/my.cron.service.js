"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCronServiceTsService = void 0;
var MyCronServiceTsService = /** @class */ (function () {
    function MyCronServiceTsService() {
    }
    MyCronServiceTsService.prototype.addCronJob = function (name, job) {
        console.log("Mock Cron job ".concat(name, " added"));
    };
    MyCronServiceTsService.prototype.onModuleInit = function () { };
    return MyCronServiceTsService;
}());
exports.MyCronServiceTsService = MyCronServiceTsService;
