$(document).ready(function() {
    $(".content-section").hide();
    $("#homepage").show();  

    $("nav ul li button").on("click", function(e) {
        e.preventDefault();  

        var targetSection = $(this).find("a").attr("href").substring(1);  

        $(".content-section").hide();
        $("#" + targetSection).show();

        var sectionLabel = $(this).text().trim(); 
        if (sectionLabel === "Home") {
            $("#headerLabel").text("Dashboard");
        } else {
            $("#headerLabel").text(sectionLabel + " Manage");
        }
    });
});
