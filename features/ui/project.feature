@ui @project
Feature: Project
  Background:
    Given I am logged in using "credentials_login_valid.json"
  
  Scenario: User able to edit project information
    When I open an existing project detail page
    And I see edit project information
    Then I edit the project information
    And I verify the project information changes

  @project_export
  Scenario Outline: User able to export project budget as <export_type>
    When I open an existing project detail page
    And I export the project budget as "<export_type>"
    Then I verify the downloaded "<export_type>" budget file is correct

  Examples:
    | export_type |
    | PDF         |
    | Excel       |
