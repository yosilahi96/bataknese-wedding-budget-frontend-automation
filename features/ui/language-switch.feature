@ui @language
Feature: Language switch
  As a user
  I want to switch the application language
  So that I can read the content in my preferred language

  Background:
    Given I am logged in using "credentials_login_valid.json"

  @smoke
  Scenario: User changes language to Indonesian and verifies page content
    Given I am on the project overview page
    When I switch the language to "id"
    Then I should see the page in "Indonesian" language
