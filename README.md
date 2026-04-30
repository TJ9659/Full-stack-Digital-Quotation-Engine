## Digital Quotation Engine

This is a full-stack insurance premium calculation system designed to automate the underwriting process for life insurance products. It features a robust calculation engine, paginated history tracking, and bulk data processing capabilities.

---

## Key Features

*   **Dynamic Premium Engine**: Real-time calculation based on gender, age, and occupation risk levels.
*   **Weighted Loading Logic**: Implements specific surcharges for smokers and tiered age-based loading.
*   **Bulk Import**: Supports processing large datasets via CSV upload (formatted for `bulk_quotation_template.csv`).
*   **Data Precision**: Built with `BigDecimal` arithmetic to ensure financial accuracy and consistent rounding.
*   **Containerized Architecture**: Backend and database services are fully containerized for consistent deployment.

---

## Tech Stack

*   **Backend**: Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL.
*   **Frontend**: React, TypeScript, Tailwind CSS, Axios.
*   **Containerization**: Docker, Docker Compose.
*   **Architecture**: RESTful API with DTO pattern for secure data transfer.

---

## Calculation Logic

The system follows a strict underwriting workflow to determine the final annual rate:

1.  **Base Premium**: Derived from Sum Assured and Gender-specific rates per RM1,000.
    *   **M**: 2.50
    *   **F**: 2.00
    *   **O**: 2.25
2.  **Smoker Surcharge**: A 25% loading is applied to the running total if the prospect is a smoker.
3.  **Age Loading**: RM2.00 is added for every year the prospect is above the age of 25.
4.  **Occupation Loading**: A percentage-based multiplier applied based on the risk class:
    *   **Class 1**: 0%
    *   **Class 2**: 10%
    *   **Class 3**: 20%
5.  **Taxation**: A 6% Service Tax is applied to the final pre-tax total.

### Example Calculation
**Input**: Male, Age 30, Class 1, Non-Smoker, RM100,000 Sum Assured.
*   **Base**: RM250.00
*   **Risk Loading**: RM10.00 (Age 25+ adjustment)
*   **Tax (6%)**: RM15.60
*   **Total Annual Rate**: **RM275.60**

---

## Project Structure

```text
├── src/main/java/com/LMS/quotation
│   ├── controller/      # REST Endpoints
│   ├── dto/             # Request/Response Data Objects
│   ├── entity/          # JPA Entities (PostgreSQL)
│   ├── enums/           # Type definitions (M/F/O, Occupation Classes)
│   ├── repository/      # Data Access Layer
│   └── service/         # Core Calculation & Business Logic
└── Frontend/            # React + TypeScript Frontend
```

---

## Deployment with Docker (Backend Only)

The backend and database are containerized for easy environment setup.

1.  **Build and start services**:
    ```bash
    docker-compose up --build
    ```
2.  **Access the API**: The backend will be available at `http://localhost:8080`.
3.  **Database**: A PostgreSQL instance is automatically configured with the following credentials:
    *   **DB**: `quotation_db`
    *   **User**: `user`
    *   **Password**: `password`

---

## Frontend Setup

The frontend is a React application built with TypeScript and Tailwind CSS.

1.  **Navigate to the frontend directory**:
    ```bash
    cd Frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm start
    ```
4.  **Access the application**: Open `http://localhost:3000` in your browser.

---

## API Reference

### Calculate Premium
`POST /api/quotations/calculate`

**Request Body**:
```json
{
  "prospectName": "Ali",
  "gender": "M",
  "age": 30,
  "occupation": "CLASS_1",
  "isSmoker": false,
  "sumAssured": 100000
}
```

### Get History
`GET /api/quotations/history?page=0&size=10`

---

## Data Templates
The system supports bulk uploads following the headers provided in `bulk_quotation_template.csv`:
`prospectName, gender, age, occupation, isSmoker, sumAssured`
```