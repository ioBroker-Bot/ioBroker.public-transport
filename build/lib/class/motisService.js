"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var motisService_exports = {};
__export(motisService_exports, {
  MotisService: () => MotisService
});
module.exports = __toCommonJS(motisService_exports);
var import_motis_fptf_client = require("@motis-project/motis-fptf-client");
var import_compat = require("@motis-project/motis-fptf-client/p/compat/index.js");
var import_throttle = require("@motis-project/motis-fptf-client/throttle.js");
class MotisService {
  client = null;
  clientName;
  constructor(clientName) {
    this.clientName = clientName;
  }
  init() {
    try {
      const profile = { ...import_compat.profile, enrichStations: false };
      this.client = (0, import_motis_fptf_client.createClient)((0, import_throttle.withThrottling)(profile), this.clientName);
      return true;
    } catch (error) {
      throw new Error(`The MOTIS client could not be initialized: ${error.message}`);
    }
  }
  isInitialized() {
    return this.client !== null;
  }
  getClient() {
    if (!this.client) {
      throw new Error("MotisService has not been initialized yet. Please call init() first.");
    }
    return this.client;
  }
  async getLocations(query, options) {
    return this.getClient().locations(query, options);
  }
  async getDepartures(stationId, options) {
    return this.getClient().departures(stationId, options);
  }
  async getJourneys(fromId, toId, options) {
    return this.getClient().journeys(fromId, toId, options);
  }
  async getStop(stationId, options) {
    return this.getClient().stop(stationId, options);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MotisService
});
//# sourceMappingURL=motisService.js.map
