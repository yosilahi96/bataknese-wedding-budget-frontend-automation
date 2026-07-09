@ui @project @vendor-comparison
Feature: Project vendor comparison

  Scenario: User can compare up to three vendor recommendations
    Given I am on the project detail page using "credentials_login_valid.json"
    When I choose 3 vendor recommendations to compare
    And I try to choose another vendor recommendation to compare
    Then I verify only 3 vendor recommendations can be compared
    When I open the vendor comparison
    Then I verify the vendor comparison shows 3 vendors
    And I verify the most budget friendly vendor is green highlighted
