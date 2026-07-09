@ui @project @vendor_recommendation_filter
Feature: Project vendor recommendation filters
  Background:
    Given I am on the project detail page using "credentials_login_valid.json"

  Scenario Outline: User able to filter vendor recommendations by area
    When I filter vendor recommendations by area "<area>"
    Then I verify vendor recommendation area filter result matched for "<area>"

    Examples:
      | area              |
      | Jakarta Pusat     |
      | Jakarta Utara     |
      | Jakarta Barat     |
      | Jakarta Selatan   |
      | Jakarta Timur     |
      | Tangerang         |
      | Tangerang Selatan |
      | Bekasi            |
      | Depok             |
      | Bogor             |

  Scenario Outline: User able to filter vendor recommendations by price
    When I filter vendor recommendations by price "<price>"
    Then I verify vendor recommendation price filter result matched for "<price>"

    Examples:
      | price      |
      | Under 10M  |
      | 10M - 50M  |
      | 50M - 100M |
      | 100M+      |

  Scenario Outline: User able to filter and sort vendor recommendations by price
    When I filter vendor recommendations by price "<price>"
    And I sort vendor recommendations by price "<sort>"
    Then I verify vendor recommendation price filter result matched for "<price>"
    And I verify vendor recommendations are sorted by price "<sort>"

    Examples:
      | price     | sort         |
      | 10M - 50M | low to high  |
      | 10M - 50M | high to low  |

  Scenario Outline: User able to filter vendor recommendations by capacity
    When I filter vendor recommendations by capacity "<capacity>"
    Then I verify vendor recommendation capacity filter result matched for "<capacity>"

    Examples:
      | capacity      |
      | < 300 pax     |
      | 300 - 500 pax |
      | 500+ pax      |
