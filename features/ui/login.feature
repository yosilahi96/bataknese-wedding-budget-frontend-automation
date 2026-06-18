@ui @login
Feature: Login
  Scenario: User can login and see the dashboard
    Given I open the Bataknese wedding login page
    When I login with email "yosilahi10@gmail.com" and password "yosua123"
    Then I should see the dashboard
