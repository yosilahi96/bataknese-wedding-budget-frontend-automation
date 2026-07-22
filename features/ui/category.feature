@ui @project @category
Feature: Project category
  Background:
    Given I am on project overview using "credentials_login_valid.json"

  @destructive
  Scenario: User able to add a project category
    When I add a category with the required field
    Then I verify the category was made on the list

  @destructive @category_delete
  Scenario: User able to delete a project category
    When I add a category with the required field
    And I delete the created category
    Then I verify the category has been deleted

  @destructive @category_edit
  Scenario: User able to edit category with planned budget greater than actual cost
    When I add a category with the required field
    And I edit the created category with planned budget "5000000" and actual cost "2000000"
    Then I verify the category budget diff is correct
    When I delete the created category
    Then I verify the category has been deleted

  @destructive @category_over_budget
  Scenario: User able to edit category with actual cost exceeding planned budget
    When I add a category with the required field
    And I edit the created category with planned budget "2000000" and over-budget actual cost "5000000"
    Then I verify the category budget diff is negative
    When I delete the created category
    Then I verify the category has been deleted

  @destructive @category_budget_remaining
  Scenario: Remaining amount is total budget minus total spent after editing categories
    When I add category "Venue" with planned budget "30000000"
    And I add category "Decoration" with planned budget "20000000"
    And I edit category "Venue" with planned budget "30000000" and actual cost "25000000"
    Then the remaining amount should equal total budget minus total spent
    And I edit category "Decoration" with planned budget "20000000" and actual cost "15000000"
    Then the remaining amount should equal total budget minus total spent
    And I delete the category named "Decoration"
    And I delete the category named "Venue"
