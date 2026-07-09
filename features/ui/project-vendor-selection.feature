@ui @project @vendor-selection
Feature: Project vendor selection

  Scenario: User able to select and remove a vendor
    Given I am on the project detail page using "credentials_login_valid.json"
    When I select a vendor recommendation
    Then I verify the vendor has been selected
    When I remove the selected vendor
    Then I verify the selected vendor has been removed
