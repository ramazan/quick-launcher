$.getJSON("config.json", function(sitesConfig) {
    initializeCards(sitesConfig);
});

function initializeCards(sitesConfig){
    Object.keys(sitesConfig).forEach(site => {
        let siteConfig = sitesConfig[site];
        $(".cards-container")
            .append('<div class=flip-card><div class=flip-card-inner><div class=flip-card-front><p class=item-name>'+site+'</div><div class="flip-card-back '+site+'"></div></div></div>');
        Object.keys(siteConfig).forEach(environment => {
            console.log(environment + ':' + siteConfig[environment]);
            $('.'+site).append('<a href='+siteConfig[environment]+' target=_blank><p class=environment>'+environment+'</p></a>');
        });
    });
}
