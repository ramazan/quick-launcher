// $.getJSON("config.json", function(sitesConfig) {
// chrome.storage.sync.set({quickLauncherSitesConfig:sitesConfig});
// initializeCards(sitesConfig);
// });

chrome.storage.sync.get(["quickLauncherSitesConfig"], function(config) {
  // initializeCards(config.quickLauncherSitesConfig);
  if (
    config["quickLauncherSitesConfig"] &&
    Object.keys(config["quickLauncherSitesConfig"]).length > 0
  ) {
    initializeCards(config.quickLauncherSitesConfig);
    $("#jsonSiteDataTextArea").val(
      JSON.stringify(config.quickLauncherSitesConfig, null, 2)
    );
  }
});

$(".add-site-container").hide();
$(".save-site-icon").hide();

$("#addSiteIcon").click(() => {
  toggleElements();
});

$("#saveSiteIcon").click(() => {
  chrome.storage.sync.set(
    { quickLauncherSitesConfig: JSON.parse($("#jsonSiteDataTextArea").val()) },
    function() {
      chrome.storage.sync.get(["quickLauncherSitesConfig"], function(config) {
        if (
          config["quickLauncherSitesConfig"] &&
          Object.keys(config["quickLauncherSitesConfig"]).length > 0
        ) {
          $(".cards-container").empty();
          initializeCards(config["quickLauncherSitesConfig"]);
        }
      });
    }
  );
  toggleElements();
});

function toggleElements() {
  $(".cards-container").toggle();
  $(".add-site-container").toggle();
  $(".save-site-icon").toggle();
  $(".add-site-icon").toggle();
}

function initializeCards(sitesConfig) {
  Object.keys(sitesConfig).forEach(site => {
    let siteConfig = sitesConfig[site];
    $(".cards-container").append(
      "<div class=flip-card><div class=flip-card-inner><div class=flip-card-front><p class=item-name>" +
        site +
        '</div><div class="flip-card-back ' +
        site +
        '"></div></div></div>'
    );
    Object.keys(siteConfig).forEach(environment => {
      // console.log(environment + ':' + siteConfig[environment]);
      $("." + site).append(
        "<a href=" +
          siteConfig[environment] +
          " target=_blank><p class=environment>" +
          environment +
          "</p></a>"
      );
    });
  });
}
