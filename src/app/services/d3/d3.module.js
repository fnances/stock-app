import angular from "angular";
import d3Factory from "./d3.factory";

const d3 = angular
  .module("d3", [])
  .factory("d3Service", d3Factory)
  .name;

export default d3;
