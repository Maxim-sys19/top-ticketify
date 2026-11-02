Ticketify

A Full-Stack Transportation and Ticket Booking System

Ticketify is a web application for a transportation and ticket booking domain, built with React, TypeScript, and NestJS. The project combines full-stack application development with hands-on infrastructure engineering, including containerized dependencies, Kubernetes networking, NGINX reverse proxying, and the Kubernetes Gateway API.

The project is also a practical learning environment for backend architecture, API design, asynchronous messaging, authentication, payment integration, and infrastructure management.

Table of Contents

Overview

Key Features

Technology Stack

Architecture

Infrastructure and Networking

Project Structure

Getting Started

Environment Configuration

Local Development

Kubernetes Networking

Development Roadmap

Learning Objectives

Overview

Ticketify is designed around a transportation and ticket booking domain. It consists of a React frontend, a NestJS backend, a MySQL database, and supporting infrastructure services.

The application is being developed alongside practical experiments in networking and backend architecture. The infrastructure work includes exposing an API through multiple entry points and understanding how requests travel between a browser, Kubernetes services, NGINX, and the backend.

The project currently follows a modular backend approach, with an architectural learning path toward clearer bounded contexts, explicit service interfaces, and event-driven integration.

Key Features

Application

React-based user interface.

Client-side routing and shared state management.

Centralized API communication using Redux Toolkit Query.

Transportation and ticket booking domain.

Authentication using JWT and Passport.

Google OAuth integration.

Email delivery and email confirmation flows.

Stripe payment integration and webhook support.

Google Maps integration.

Backend and Infrastructure

REST API built with NestJS.

MySQL persistence using TypeORM.

Redis integration.

RabbitMQ messaging infrastructure.

Email testing with MailDev.

Docker Compose for local infrastructure dependencies.

Kubernetes networking experiments using Minikube.

NGINX reverse proxy for API traffic.

NGINX Gateway Fabric implementing the Kubernetes Gateway API.

Technology Stack

Area

Technologies

Frontend

React 18, TypeScript

State management

Redux Toolkit, React Redux

API client

RTK Query

Routing

React Router

UI

Bootstrap, React Bootstrap

Maps

Google Maps JavaScript integration

Backend

NestJS 10, Node.js, TypeScript

API and validation

REST, class-validator, class-transformer

Database

MySQL

ORM

TypeORM

Authentication

JWT, Passport, Google OAuth

Payments

Stripe

Caching and data access

Redis

Messaging

RabbitMQ, AMQP

Email

Nodemailer, Handlebars templates, MailDev

Local infrastructure

Docker, Docker Compose

Orchestration

Kubernetes, Minikube

Networking

NGINX, NGINX Gateway Fabric, Kubernetes Gateway API

Architecture

High-Level Architecture

flowchart TD
    User["User / Browser"]
    Frontend["React Frontend"]
    RTK["RTK Query API Layer"]
    Gateway["Kubernetes Gateway API"]
    Nginx["NGINX Reverse Proxy"]
    Backend["NestJS Backend"]
    DB[("MySQL")]
    Redis[("Redis")]
    RabbitMQ["RabbitMQ"]
    Stripe["Stripe API"]
    Mail["Email / MailDev"]

    User --> Frontend
    Frontend --> RTK
    RTK --> Gateway
    Gateway --> Nginx
    Nginx --> Backend
    Backend --> DB
    Backend --> Redis
    Backend --> RabbitMQ
    Backend --> Stripe
    Backend --> Mail

The diagram represents the intended request flow through the gateway and reverse proxy. During local development, the backend can also be accessed directly, and the NGINX NodePort can be used as an alternative entry point.

Frontend

The frontend is located in react-client/.

Its main responsibilities are:

Rendering the user interface.

Managing client-side navigation.

Maintaining shared application state.

Sending API requests through RTK Query.

Handling API responses and presenting application data.

RTK Query is part of Redux Toolkit and provides a centralized approach to API requests, caching, and request lifecycle management.

Backend

The backend is located in nest_server/.

It is built with NestJS and TypeScript and is responsible for API endpoints, business logic, persistence, authentication, and integrations with external services.

The backend dependencies include TypeORM, MySQL, Redis, RabbitMQ, JWT authentication, Google OAuth, Stripe, and email templating.

The architecture is being developed with an emphasis on modularity and clear boundaries between business logic and infrastructure concerns.

Supporting Services

The local infrastructure includes several supporting services:

MySQL for relational persistence.

Redis for caching and Redis-backed functionality.

RabbitMQ for message-based communication.

MailDev for inspecting emails during development.

Stripe CLI for forwarding Stripe webhook events to the local backend.

Infrastructure and Networking

One of the main technical aspects of Ticketify is experimenting with different ways to expose a backend API through Kubernetes networking.

The local Kubernetes environment uses Minikube with the Docker driver.

Request Flow

flowchart TD
    Browser["Browser / React Client"]
    Gateway["NGINX Gateway Fabric"]
    GatewayService["Gateway NodePort"]
    NginxService["NGINX NodePort Service"]
    NginxPod["NGINX Pod"]
    BackendService["Kubernetes Backend Service"]
    Endpoint["Manual EndpointSlice"]
    Nest["NestJS on Host"]

    Browser --> GatewayService
    GatewayService --> Gateway
    Gateway --> NginxService
    NginxService --> NginxPod
    NginxPod --> BackendService
    BackendService --> Endpoint
    Endpoint --> Nest

The backend currently runs on the host machine rather than inside the Minikube cluster. A Kubernetes Service and manually configured EndpointSlice provide the connection to the host backend.

This setup is intended for local development and networking practice, not as a production deployment architecture.

Three Ways to Access the Backend

Entry point

Local address

Purpose

Gateway API

http://ticketify.local:32713

Entry point through the Kubernetes Gateway API

NGINX NodePort

http://192.168.49.2:32204

Direct access to the NGINX reverse proxy

NestJS directly

http://localhost:8000

Direct access to the backend on the host

The Gateway API route uses the hostname ticketify.local. The frontend API base URL must include the appropriate API prefix configured by the backend and proxy.

For the Gateway-based setup, the local hostname can be mapped to the Minikube node IP in /etc/hosts:

192.168.49.2 ticketify.local

The corresponding frontend API base URL is:

http://ticketify.local:32713/api

The direct backend and NGINX entry points are useful for isolating networking issues and testing individual parts of the request path.

Kubernetes Components

The local Kubernetes environment includes:

Minikube as the local Kubernetes cluster.

NGINX Gateway Fabric as the Gateway API implementation.

Gateway and HTTPRoute resources for routing traffic.

NGINX Deployment and Service for reverse proxying.

Backend Service and EndpointSlice for reaching the host-based NestJS process.

ConfigMaps for non-sensitive configuration.

Secrets for sensitive configuration where applicable.

The primary application namespace is ticketify-dev. The Gateway Fabric is installed in the nginx-gateway namespace.

For the current local configuration, the Minikube node IP is 192.168.49.2, the Gateway NodePort is 32713, and the NGINX NodePort is 32204. These values are environment-specific and may change when the cluster is recreated.

Project Structure

top-ticketify/
├── react-client/             # React frontend
├── nest_server/               # NestJS backend
├── mysql/                     # MySQL configuration
├── docker-compose.yml         # Local infrastructure services
└── README.md

The Kubernetes manifests are maintained separately under the backend project's k8s/ directory.

The directory is used for declarative infrastructure configuration, including the namespace, backend connectivity, NGINX, Gateway API resources, and supporting services.

Getting Started

Prerequisites

Install the following tools before starting local development:

Node.js and npm versions compatible with the project dependencies.

Git.

Docker and Docker Compose.

MySQL client (optional, for database inspection).

Minikube and kubectl (for Kubernetes networking).

Helm, if needed to install NGINX Gateway Fabric.

A Google Maps API key if using map functionality.

Stripe test credentials if testing payment functionality.

1. Clone the Repository

git clone https://github.com/Maxim-sys19/top-ticketify.git
cd top-ticketify

2. Start Local Infrastructure Dependencies

Review docker-compose.yml and configure the required environment variables before starting the services.

docker compose up -d db_service redis_service rabbitmq_service maildev

The Compose configuration also includes a Stripe CLI service. Start it separately when Stripe webhook testing is required and the relevant credentials are configured.

Note that the NestJS service definition in the current Compose file is commented out. The backend is therefore started separately in the current development setup.

3. Start the Backend

cd nest_server
npm install

Configure the backend environment variables and database connection before running the application.

Start the development server:

npm run start:dev

The backend listens on port 8000 in the current local setup.

4. Start the Frontend

Open another terminal:

cd react-client
npm install
npm start

The React development server normally runs at:

http://localhost:3000

Configure the frontend API base URL to point to the desired backend entry point.

For direct local development, use the backend URL and API prefix configured by the application. For Gateway testing, use the ticketify.local hostname and Gateway NodePort described above.

Environment Configuration

The backend requires environment-specific configuration for database connectivity, authentication, email delivery, and external integrations.

Depending on the enabled features, configuration may include:

MySQL connection settings.

Redis connection settings.

RabbitMQ connection settings.

JWT secrets and expiration settings.

Google OAuth credentials.

Stripe test credentials and webhook configuration.

SMTP or MailDev settings.

Google Maps API key for the frontend.

Use the project's existing environment variable names and configuration files as the source of truth when setting up the application.

Do not commit .env files, production credentials, API keys, or real secrets to version control. Use local environment files or an appropriate secrets management mechanism.

Local Development

Useful Commands

Frontend

cd react-client

npm start
npm test
npm run build

Backend

cd nest_server

npm run start:dev
npm run build
npm run test
npm run test:e2e
npm run migration:run

The migration commands use the TypeORM configuration defined by the backend project.

Troubleshooting

The API returns 404 Cannot GET /

This does not necessarily mean the backend is unavailable. The root route may not be defined. Test a known API endpoint with the configured global prefix.

The Gateway returns the NGINX welcome page

Verify that the request uses the hostname expected by the HTTPRoute, including ticketify.local.

The browser cannot reach the API

Check the frontend API base URL, the hostname mapping, the Gateway or NGINX NodePort, backend availability, and the backend CORS configuration.

The NGINX proxy cannot reach NestJS

Check the NGINX upstream configuration, the Kubernetes Service, its EndpointSlice, the host address, and host firewall rules.

Development Roadmap

The project also serves as a practical environment for learning and applying backend architecture concepts.

Potential areas of continued development include:

Strengthening modular boundaries in the NestJS application.

Defining explicit public interfaces between business modules.

Separating domain logic from infrastructure implementations.

Exploring bounded contexts and service ownership.

Introducing reliable asynchronous workflows with RabbitMQ.

Applying the transactional outbox pattern where required.

Improving Kubernetes manifests and service networking.

Documenting API contracts and deployment procedures.

Expanding automated testing and operational observability.

These are development and learning directions rather than claims that every item is already implemented.

Learning Objectives

Through Ticketify, I am developing practical experience in:

Full-stack development with React and NestJS.

REST API integration and centralized client-side data fetching.

Authentication, authorization, and third-party integrations.

Relational database modeling and ORM-based persistence.

Asynchronous messaging and backend integration patterns.

Modular backend architecture and domain-driven design concepts.

Docker-based local development environments.

Kubernetes Services, EndpointSlices, NodePorts, and Gateway API routing.

Reverse proxy configuration and network troubleshooting.

Repository

GitHub: Maxim-sys19/top-ticketify
