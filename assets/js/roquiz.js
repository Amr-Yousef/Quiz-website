$(document).ready(function() {

    $("#start").click(function() {

        fields_json = {
            "set": $("#questionsSet").val(),
            "numberOfQuestions": $("#questionsNumber").val(),
            "difficulty": $("#diffSlider").val(),
        }

        // TODO: Do checks here.
        // If everything is ok, continue from here.

        sessionStorage.setItem("fields", JSON.stringify(fields_json));
        window.location.href = "./quiz.html";

    });

});