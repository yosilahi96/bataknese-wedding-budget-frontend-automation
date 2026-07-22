@ui @project @budget_overview
Feature: Budget Overview

  Background:
    Given I am logged in using "credentials_login_valid.json"

  Scenario: User verify budget overview totals for Pesta Adat
    Given I am on the project overview page
    When I view the budget overview for "Pesta Adat"
    Then the total planned and spent in the budget overview for "Pesta Adat" should match the sum of all "Pesta Adat" project budgets

  Scenario: User verify budget overview totals for 3M Ceremony
    Given I am on the project overview page
    When I view the budget overview for "3M Ceremony"
    Then the total planned and spent in the budget overview for "3M Ceremony" should match the sum of all "3M Ceremony" project budgets
