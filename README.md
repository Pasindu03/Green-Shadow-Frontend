# Crop Monitoring System for Green Shadow (Pvt) Ltd

**Green Shadow (Pvt) Ltd**, based in Matale, Sri Lanka, is a mid-scale farm specializing in root crops and cereals. Renowned for its high-quality production, the company operates at both national and international levels. In response to recent expansions and a shift towards large-scale production, the management has initiated the development of a comprehensive **Crop Monitoring System** to efficiently manage their fields, crops, and related assets.

## System Overview

The **Crop Monitoring System** is designed to streamline agricultural operations by systemizing key areas of the business:

### Key Features:
1. **Field Management**: Tracks and manages land designated for cultivation, including crop assignments and staff allocations.
2. **Crop Monitoring**: Maintains detailed records of crop types, growth stages, and field observations.
3. **Staff Management**: Handles assignments, roles, and contact information for all staff.
4. **Monitoring Logs**: Captures field observations, crop details, and staff activity logs.
5. **Vehicle Management**: Oversees vehicle assignments for monitoring and operations.
6. **Equipment Management**: Tracks agricultural equipment usage and assignments.
7. **User Access Control**: Supports role-based access for MANAGER, ADMINISTRATIVE, and SCIENTIST, with distinct permissions for CRUD operations.

### Key Business Processes:
- **Role-Based Access Control**:
    - **MANAGER**: Full access to all system features.
    - **ADMINISTRATIVE**: Restricted access to crop and field data.
    - **SCIENTIST**: Limited to crop-related functionalities.
- **Data Analysis**:
    - **Relational Analysis**: Evaluates resource allocations and relationships.
    - **Spatial & Temporal Analysis**: Provides insights based on location and time.

### Main Services:
1. **Field Service**: Allocates and manages cultivation fields.
2. **Crop Service**: Tracks crop information, including types and growth stages.
3. **Staff Service**: Manages human resources and assignments.
4. **Monitoring Service**: Records and tracks crop-related observations and activities.
5. **Vehicle Service**: Handles vehicle management for field operations.
6. **Equipment Service**: Monitors agricultural equipment usage and availability.
7. **Auth Service**: Manages secure user authentication and role-based permissions.

## Database Structure

The system uses a well-defined database schema with the following key entities:

- **Field**: Tracks field location, size, and associated staff/crops.
- **Crop**: Stores details like common/scientific names, category, and season.
- **Staff**: Manages personal details, roles, and assignments.
- **Monitoring Logs**: Records field/crop observations with images.
- **Vehicle**: Tracks vehicle details, fuel type, and assigned staff.
- **Equipment**: Manages equipment details and assignments.
- **User**: Maintains secure user credentials and roles.

## Technologies Used

- **Backend**: Spring Boot (REST APIs, Security, Data Persistence)
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript, jQuery, and AJAX
- **Authentication**: Spring Security with JWT
- **Analysis Features**: Spatial and temporal data evaluation