@ui @project
Feature: vendor
  Background:
    Given I am on project overview using "credentials_login_valid.json"
  
  Scenario: User able to edit project information
    When I see edit project inforation
    Then I edit the project information
    And I verify the project information changes
    