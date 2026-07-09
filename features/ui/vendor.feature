@ui @vendor_user
Feature: vendor
  Background:
    Given I am logged in using "credentials_login_valid.json"
    
  Scenario: User able to view list of vendor and view vendor details
    When I able to access vendor page
    Then I should see list of vendor
    And I should see vendor details

  @vendor_filter
  Scenario: User able to filter list of vendor by category
    When I able to access vendor page
    Then I should see list of vendor
    And I should able to filter vendor by "<category_dropdown>"
  Examples:
    | category_dropdown |
    | venue             |
    | catering          |
    | gondang           |

  @vendor_batak_specialist_filter
  Scenario Outline: User able to filter list of vendor by Batak specialist
    When I navigate to vendor directory page
    And I check "<specialist_filter>" vendor filter
    Then I wait until vendor list is filtered by "<specialist_filter>"
    And I should see only "<specialist_filter>" vendors in the list

  Examples:
    | specialist_filter |
    | Batak Specialist  |



