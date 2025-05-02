import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey("employee.id"), nullable=True)

    employees = db.relationship('Employee', backref='restaurant', lazy=True, foreign_keys='Employee.restaurant_id')
    schedules = db.relationship('Schedule', backref='restaurant', lazy=True)

    def __repr__(self):
        return f"<Restaurant {self.name}>"

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    salary = db.Column(db.Integer, nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey("employee.id"), nullable=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurant.id"), nullable=False)

    def __repr__(self):
        return f"<Employee {self.first_name} {self.last_name}>"

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employee.id"), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurant.id"), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.String(50), nullable=False)
    end_time = db.Column(db.String(50), nullable=False)
    duration = db.Column(db.Float, nullable=True)

    __table_args__ = (
        db.Index('idx_restaurant_date', 'restaurant_id', 'date'),  # composite index
        db.Index('idx_duration', 'duration'),                      # single index
    )

    def calculate_duration(self):
        fmt = "%H:%M:%S"
        try:
            start_dt = datetime.strptime(self.start_time, fmt)
            end_dt = datetime.strptime(self.end_time, fmt)
            delta = end_dt - start_dt
            self.duration = round(delta.total_seconds() / 3600, 2)
        except Exception:
            self.duration = None

    def __repr__(self):
        return f"<Schedule {self.id}>"