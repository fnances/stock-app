

const d3Factory = function ($document, $window, $q, $rootScope) {
  var d = $q.defer();
  function onScriptLoad () {
    $rootScope.$apply(() =>  d.resolve($window.d3));
  }
  const scriptTag = $document[0].createElement("script");
  scriptTag.type = "text/javascript";
  scriptTag.async = true;
  scriptTag.src = "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js";
  scriptTag.onreadystatechange = function () {
    if (this.readyState === "complete") {
      onScriptLoad();
    }
  };

  scriptTag.onload = onScriptLoad;

  const s = $document[0].getElementsByTagName("body")[0];
  s.appendChild(scriptTag);

  return {
    d3 () { return d.promise; }
  };
};

d3Factory.$inject = ["$document", "$window", "$q", "$rootScope"];

export default d3Factory;
