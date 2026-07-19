@ui @project @project_type
Feature: Project type
  Background:
    Given I am logged in using "credentials_login_valid.json"

  @destructive
  Scenario Outline: User able to create a project with type <project_type>
    When I create a project with type "<project_type>"
    Then I verify the project type is "<project_type>"

    Examples:
      | project_type |
      | 3M           |
