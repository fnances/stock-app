import angular from "angular";
import Graph from "./Graph/graph.module";
import DailyChart from "./DailyChart/dailychart.module";
import CompanyDetails from "./CompanyDetails/companydetails.module";
import d3 from "../services/d3/d3.module";

const Components = angular
  .module("Components", [Graph, DailyChart, CompanyDetails, d3])
  .name;

export default Components;
