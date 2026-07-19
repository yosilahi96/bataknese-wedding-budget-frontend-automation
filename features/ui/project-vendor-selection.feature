@ui @project @vendor-selection
Feature: Project vendor selection

  @destructive
  Scenario: User able to select and remove a vendor
    Given I am on the project detail page using "credentials_login_valid.json"
    When I select a vendor recommendation
    Then I verify the vendor has been selected
    When I remove the selected vendor
    Then I verify the selected vendor has been removed

  @destructive @vendor_reselect
  Scenario: User cannot select an already selected vendor again
    Given I am on the project detail page using "credentials_login_valid.json"
    When I select a vendor recommendation
    Then I verify the vendor has been selected
    And I verify the selected vendor cannot be selected again
    When I remove the selected vendor
    Then I verify the selected vendor has been removed
