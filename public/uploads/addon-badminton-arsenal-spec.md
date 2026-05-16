# **Badminton Arsenal & Stringing Management Spec**

## **1\. Overview**

Transform the simple loyalty app into a specialized CRM for badminton enthusiasts. It tracks stringing lifecycles, equipment history, and tension preferences.

## **2\. Key Features**

### **Admin Functions**

* **Service Logging**: Log racket stringing services with auto-populated dates (editable).  
* **Smart Presets**: Searchable dropdowns for Racket Brands/Models and String Brands/Models.  
* **Tension Quick-Select**: Quick-tap buttons for common tensions (e.g., 24, 26, 28 lbs) \+ manual entry.

### **Customer "Arsenal" Panel**

* **Purchase History**: Unified view of all transactions and services.  
* **Equipment Library**: List of all rackets owned and their current stringing status.  
* **Analytics**:  
  * **Most Used String**: Visual breakdown of string preferences.  
  * **Tension Trend Chart**: Chart.js line graph showing tension changes over time (Service Date vs. Lbs).  
* **Maintenance Tracker**: "Days since last stringing" counter with fatigue alerts (e.g., Change recommended after 90 days).

## **3\. Data Logic**

| Action | Database Impact |
| :---- | :---- |
| Log Stringing | Updates stringing\_services and adds a transaction entry. |
| View Arsenal | Fetches aggregated data from stringing\_services grouped by racket\_model. |

