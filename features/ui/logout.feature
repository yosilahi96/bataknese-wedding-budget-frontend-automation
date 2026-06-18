@ui @logout
Feature: Logout
  Scenario: User able to logout
    Given I open the Bataknese wedding login page
    When I login using "credentials_login_valid.json"
    Then I should see "dashboard"
    And I able to logout
    And I open the Bataknese wedding login page
