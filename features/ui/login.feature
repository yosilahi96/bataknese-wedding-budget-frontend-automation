@ui @login
Feature: Login
  Scenario Outline: User login result follows the credential file
    Given I open the Bataknese wedding login page
    When I login using "<credentials>"
    Then I should see "<result>"

  Examples:
    | credentials                    | result               |
    | credentials_login_valid.json   | dashboard            |
    | credentials_login_invalid.json | login failed message |
