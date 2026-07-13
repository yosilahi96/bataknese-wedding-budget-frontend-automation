@ui @project_pagination
Feature: Project Pagination
  Background:
    Given I am logged in using "credentials_login_valid.json"

  Scenario: User verify pagination buttons on project list
    Given I am on the project list page
    Then I verify the "Previous" pagination button is disabled
    When I go to the latest page of the project list
    Then I verify the "Next" pagination button is disabled
