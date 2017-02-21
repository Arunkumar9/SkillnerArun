--Adding the type of the busisness events
-- If the type is D -- Dimesnion Table
-- if the type is F -- Fact Table

ALTER TABLE business_events ADD COLUMN table_type VARCHAR(1) DEFAULT 'F' NOT NULL;
