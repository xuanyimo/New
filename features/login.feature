
Feature: Oracle Login

  Scenario: Invalid login attempt
    Given user is on Oracle login page
    When user enters username "#username"
    When user enters password "'#password"
    Then error message should be displayed


    
  Scenario: User navigates to My Team tab
    Given user is on Oracle login page
    When user enters username "#username"
    When user enters password "#password"
    Then user clicks on My Team tab
