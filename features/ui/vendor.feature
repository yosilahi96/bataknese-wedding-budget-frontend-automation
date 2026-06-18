@ui @vendor_user
Feature: vendor
  Background:
    Given I am logged in using "credentials_login_valid.json"
    
  Scenario: User able to view list of vendor and view vendor details
    When I able to access vendor page
    Then I should see list of vendor
    And I should see vendor details



