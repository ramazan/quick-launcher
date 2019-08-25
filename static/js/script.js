/** Get stored sites config from chrome sync storage */
getSitesConfigFromChromeSyncStorage("quickLauncherSitesConfig");

/** initially hide the second screen(add JSON) */
hideTextAreaScreen();

/**
 * @description get stored sites JSON config from chrome sync storage
 * and initialize the cards
 * @param {string} key - name of key to retrive config
 */
function getSitesConfigFromChromeSyncStorage(key) {
  chrome.storage.sync.get([key], siteConfig => {
    /** if config found, initialize the cards */
    if (siteConfig[key]) {
      initializeCards(siteConfig[key]);

      /** Populate the text area with config */
      populateTextArea(siteConfig[key]);
    }
  });
}

/**
 * @description save the sites config in chrome sync storage
 * @param {string} key - name of key
 * @param {Object} config - sites config
 */
function setSitesConfigToChromeSyncStorage(key, config){
  chrome.storage.sync.set({[key] : config});
}

/**
 * @description - populates the text-area with JSON object
 * @param {Object} config - sites config
 */
function populateTextArea(config) {
  $("#jsonSiteDataTextArea").val(
    JSON.stringify(config, null, 2)
  );
}

/** Hide the add JSON screen HTML elements */
function hideTextAreaScreen() {
  $("#addSiteDataContainer").hide();
  $("#saveSiteIcon").hide();
  $("#jsonSiteDataError").hide();
  $("#goBack").hide();
}

/** Hide/Show specific elements based on current screen */
function toggleScreenElements() {
  $(".cards-container").toggle();
  $(".add-site-container").toggle();
  $(".save-site-icon").toggle();
  $(".add-site-icon").toggle();
  $("#goBack").toggle();
}

/** Show add site data screen on '+' click */
$("#addSiteIcon").click(() => {
  $("#jsonSiteDataTextArea").attr("rows", 25);
  toggleScreenElements();
});

/** Show cards screen(home screen) on '<-'(go back) click */
$("#goBack").click(() => {
  toggleScreenElements();
});

/** On save click */
$("#saveSiteIcon").click(() => {
  /** if valid JSON Object entered in textarea */
  if ($("#jsonSiteDataTextArea").val() && ValidateJSON($("#jsonSiteDataTextArea").val())) {
    /** save config to chrome sync storage */
    setSitesConfigToChromeSyncStorage("quickLauncherSitesConfig", 
    JSON.parse($("#jsonSiteDataTextArea").val()));
    /** reset the cards */
    $(".cards-container").empty();

    /** initialize the cards with new data */
    getSitesConfigFromChromeSyncStorage("quickLauncherSitesConfig");

    /** decrease the rows in textarea to decrease height */
    $("#jsonSiteDataTextArea").attr("rows", 5);

    /** show the homescreen */
    toggleScreenElements();
  }
});

/** validates JSON and shows errors */
function ValidateJSON(json) {
  var checkedjson;
  try {
    checkedjson = JSON.parse(json);
  } catch (e) {
    /** set error */
    $("#jsonSiteDataError").show().text(e.message);

    /** hide error after 10 secs */
    setTimeout(() => {
      $("#jsonSiteDataError").hide();
    }, 8000);
  }
  return checkedjson;
}

/** initializes the cards */
function initializeCards(sitesConfig) {
  /** hide no data text */
  $("#noSiteData").hide();
  /** loop through config */
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
