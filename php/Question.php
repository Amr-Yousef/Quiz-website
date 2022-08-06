<?php
require_once 'DBController.php';

class Question {
    public $title;
    public $choices;
    public $answer;
    
    public function __construct($title, $choices, $answer) {
        $this->title = $title;
        $this->choices = $choices;
        $this->answer = $answer;
    }

    public function getTitle() {
        return $this->title;
    }

    public function getChoices() {
        return $this->choices;
    }

    public function getAnswer() {
        return $this->answer;
    }

    public function stringfyChoices() {
        return json_encode($this->choices);
    }

    public function insertToDB(){
        $choices = $this->stringfyChoices();

        $db = new DBController();
        $db->openConnection();
        $query = "INSERT INTO questions (title, choices, answer) VALUES ('$this->title', '$choices', '$this->answer')";
        $result = $db->insert($query);
        $db->closeConnection();
        return $result;
    }
}

?>