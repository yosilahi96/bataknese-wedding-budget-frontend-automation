@ui @project @vendor_recommendation
Feature: Project vendor recommendation
  Background:
    Given I am on project overview using "credentials_login_valid.json"

  Scenario: User able to search vendor recommendation
    When I search vendor recommendation "Wisma GKPS Cikini"
    Then I verify the vendor recommendation search result matched
