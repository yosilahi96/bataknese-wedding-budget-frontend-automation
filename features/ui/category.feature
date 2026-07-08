@ui @project @category
Feature: Project category
  Background:
    Given I am on project overview using "credentials_login_valid.json"

  Scenario: User able to add a project category
    When I add a category with the required field
    Then I verify the category was made on the list
