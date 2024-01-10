## Table of Contents
1. [Description](#description)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Accessing the Database](#accessing-the-database)
6. [Usage](#usage)
7. [Monitoring with Prometheus](#monitoring-with-prometheus)
8. [Email Testing with Mailtrap](#email-testing-with-mailtrap)
9. [Contact](#contact)
10. [License](#license)

## Description

The BTC Application is an API service designed to track and provide real-time information about the Bitcoin (BTC) to Ukrainian Hryvnia (UAH) exchange rate. It allows users to subscribe with their email addresses to receive updates on the BTC to UAH rate and provides functionality to send the current rate to all subscribed users. The project is implemented with a focus on functionality, scalability, and robust data handling.

## Technologies Used
- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **Prisma**
- **Docker**
- **Prometheus**
- **Mailtrap**

## Prerequisites
- Docker and Docker Compose should be installed on your machine.
- Node.js should be installed for running the application locally.
- PostgreSQL should be set up for database management.

## Installation

1. Clone the repository
2. Navigate to the project directory

```bash
# Install Node.js Dependencies
$ npm install

# Start the Application with Docker Compose
$ docker-compose up --build
```

## Accessing the Database

```bash
# To access the database locally
$ psql -h localhost -p 5432 -U btc-app-user -d btc-app-db

# Showing all users with theri statuses
$ SELECT * FROM "Subscription";
```

## Usage

After successfully installing the application, you can use Postman to interact with the following endpoints:

### Get Current BTC to UAH Rate
- **Endpoint:** `/rate`
- **Method:** GET
- **Description:** Returns the latest BTC to UAH exchange rate.
- **Example Request:** `http://localhost:3001/rate`

### Subscribe Email to Receive Current Rate
- **Endpoint:** `/subscribe`
- **Method:** POST
- **Description:** Subscribes an email to receive updates on the exchange rate.
- **Example Request in Postman:**
  Send a POST request to `http://localhost:3001/subscription/subscribe` with the following JSON body:
```json
  {
      "email": "example@example.com"
  }
```

  ### Unsubscribe Email
- **Endpoint:** `/unsubscribe`
- **Method:** DELETE
- **Description:** Unsubscribes an email from receiving updates.
- **Example Request in Postman:**
  Send a DELETE request to `http://localhost:3001/subscription/unsubscribe` with the following JSON body:
```json
  {
      "email": "example@example.com"
  }
```

  ### Get All Emails
- **Endpoint:** `/emails`
- **Method:** GET
- **Description:** Retrieves a list of all subscribed and unsubscribed emails with their statuses.
- **Example Request in Postman:**
  Send a GET request to `http://localhost:3001/subscription/emails`

  ### Send Current BTC Rate to All Subscribers
- **Endpoint:** `/send`
- **Method:** POST
- **Description:** Sends the current BTC to UAH rate to all subscribed emails.
- **Example Request in Postman:**
  Send a POST request to `http://localhost:3001/subscription/send`

## Monitoring with Prometheus
The BTC Application is integrated with Prometheus for monitoring and tracking application metrics.

### Accessing Prometheus Metrics
- **Endpoint for Metrics:** `/metrics`
- **Method:** GET
- **Usage:** Access this endpoint to view various metrics collected by Prometheus, such as the rate of email subscriptions, unsubscriptions, email sending errors, and more.
- **Example:** Open `http://localhost:3001/metrics` in your browser to view the metrics dashboard but it it easier to look at Prometheus metrics at their UI. It is located on `http://localhost:9090`.

### Email Testing with Mailtrap
For testing email functionalities, the application uses Mailtrap, a fake SMTP server.

### Viewing Sent Emails in Mailtrap
1. **Set Up a Mailtrap Account:** If you don't have one, create a free account at [Mailtrap.io](https://mailtrap.io).
2. **Configure Mailtrap Credentials:** In your application, set up the SMTP configuration with your Mailtrap credentials (username and password).
3. **Sending Test Emails:** Use the application to send emails as per usual. These emails will be intercepted by Mailtrap.
4. **Check Your Mailtrap Inbox:** Log in to your Mailtrap account and go to your inbox to view the emails sent by the application. You'll see the emails that are "sent" by your application, allowing you to review their content and headers.

## Contact

- For any additional questions or feedback, please contact dobrovolskyi.dev@gmail.com or Telegram `@d_dobrovolsky`.


## License

This project is released under [MIT License](LICENSE).
