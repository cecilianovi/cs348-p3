from flask import Blueprint, request, jsonify
from models import db, Restaurant, Employee, Schedule
from datetime import datetime
from sqlalchemy import text



routes = Blueprint("routes", __name__)

# --- RESTAURANT ROUTES ---

@routes.route("/restaurants", methods=["POST"])
def add_restaurant():
    data = request.json
    try:
        query = text("""
            INSERT INTO restaurant (name, address, phone_number, manager_id)
            VALUES (:name, :address, :phone_number, :manager_id)
        """)
        result = db.session.execute(query, {
            "name": data["name"],
            "address": data["address"],
            "phone_number": data["phone_number"],
            "manager_id": data.get("manager_id")
        })
        db.session.commit()
        return jsonify({"message": "Restaurant added!", "id": result.lastrowid}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@routes.route("/restaurants", methods=["GET"])
def get_restaurants():
    restaurants = Restaurant.query.all()
    return jsonify([{
        "id": r.id,
        "name": r.name,
        "address": r.address,
        "phone_number": r.phone_number,
        "manager_id": r.manager_id
    } for r in restaurants])

@routes.route("/restaurants/<int:id>", methods=["GET"])
def get_restaurant(id):
    restaurant = Restaurant.query.get(id)
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    return jsonify({
        "id": restaurant.id,
        "name": restaurant.name,
        "address": restaurant.address,
        "phone_number": restaurant.phone_number,
        "manager_id": restaurant.manager_id
    })

@routes.route("/restaurants/<int:id>", methods=["PUT"])
def update_restaurant(id):
    data = request.json
    restaurant = Restaurant.query.get(id)
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    try:
        restaurant.name = data.get("name", restaurant.name)
        restaurant.address = data.get("address", restaurant.address)
        restaurant.phone_number = data.get("phone_number", restaurant.phone_number)
        restaurant.manager_id = data.get("manager_id", restaurant.manager_id)
        db.session.commit()
        return jsonify({"message": "Restaurant updated!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@routes.route("/restaurants/<int:id>", methods=["DELETE"])
def delete_restaurant(id):
    restaurant = Restaurant.query.get(id)
    if not restaurant:
        return jsonify({"error": "Restaurant not found"}), 404
    db.session.delete(restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurant deleted!"})


# --- EMPLOYEE ROUTES ---

@routes.route("/employees", methods=["POST"])
def add_employee():
    data = request.json
    try:
        query = text("""
            INSERT INTO employee (first_name, last_name, position, phone_number, salary, manager_id, restaurant_id)
            VALUES (:first_name, :last_name, :position, :phone_number, :salary, :manager_id, :restaurant_id)
        """)
        result = db.session.execute(query, {
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "position": data["position"],
            "phone_number": data["phone_number"],
            "salary": data["salary"],
            "manager_id": data.get("manager_id"),
            "restaurant_id": data["restaurant_id"]
        })
        db.session.commit()
        return jsonify({"message": "Employee added!", "id": result.lastrowid}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@routes.route("/employees", methods=["GET"])
def get_employees():
    employees = Employee.query.all()
    return jsonify([{
        "id": e.id,
        "first_name": e.first_name,
        "last_name": e.last_name,
        "position": e.position,
        "phone_number": e.phone_number,
        "salary": e.salary,
        "manager_id": e.manager_id,
        "restaurant_id": e.restaurant_id
    } for e in employees])

@routes.route("/employees/<int:id>", methods=["GET"])
def get_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify({
        "id": employee.id,
        "first_name": employee.first_name,
        "last_name": employee.last_name,
        "position": employee.position,
        "phone_number": employee.phone_number,
        "salary": employee.salary,
        "manager_id": employee.manager_id,
        "restaurant_id": employee.restaurant_id
    })

@routes.route("/employees/<int:id>", methods=["PUT"])
def update_employee(id):
    data = request.json
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    try:
        employee.first_name = data.get("first_name", employee.first_name)
        employee.last_name = data.get("last_name", employee.last_name)
        employee.position = data.get("position", employee.position)
        employee.phone_number = data.get("phone_number", employee.phone_number)
        employee.salary = data.get("salary", employee.salary)
        employee.manager_id = data.get("manager_id", employee.manager_id)
        employee.restaurant_id = data.get("restaurant_id", employee.restaurant_id)
        db.session.commit()
        return jsonify({"message": "Employee updated!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@routes.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted!"})


# --- SCHEDULE ROUTES ---

@routes.route("/schedule", methods=["POST"])
def add_schedule():
    data = request.json

    # Calculate duration
    fmt = "%H:%M"
    try:
        start_dt = datetime.strptime(data["start_time"], fmt)
        end_dt = datetime.strptime(data["end_time"], fmt)
        delta = end_dt - start_dt
        duration = round(delta.total_seconds() / 3600, 2)
    except Exception:
        duration = None

    try:
        query = text("""
            INSERT INTO schedule (employee_id, restaurant_id, date, start_time, end_time, duration)
            VALUES (:employee_id, :restaurant_id, :date, :start_time, :end_time, :duration)
        """)
        result = db.session.execute(query, {
            "employee_id": data["employee_id"],
            "restaurant_id": data["restaurant_id"],
            "date": data["date"],
            "start_time": data["start_time"],
            "end_time": data["end_time"],
            "duration": duration
        })
        db.session.commit()
        return jsonify({"message": "Schedule added!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@routes.route("/schedule/<int:id>", methods=["GET"])
def get_schedule(id):
    schedule = Schedule.query.get(id)
    if not schedule:
        return jsonify({"error": "Schedule not found"}), 404
    return jsonify({
        "id": schedule.id,
        "employee_id": schedule.employee_id,
        "restaurant_id": schedule.restaurant_id,
        "date": schedule.date,
        "start_time": schedule.start_time,
        "end_time": schedule.end_time
    })

@routes.route("/schedule", methods=["GET"])
def get_all_schedules():
    schedules = Schedule.query.all()
    return jsonify([{
        "id": s.id,
        "employee_id": s.employee_id,
        "restaurant_id": s.restaurant_id,
        "date": datetime.strptime(str(s.date), "%Y-%m-%d").strftime("%Y-%m-%d"),
        "start_time": s.start_time,
        "end_time": s.end_time
    } for s in schedules])

@routes.route("/schedule/<int:id>", methods=["PUT"])
def update_schedule(id):
    data = request.json
    schedule = Schedule.query.get(id)
    if not schedule:
        return jsonify({"error": "Schedule not found"}), 404
    try:
        schedule.employee_id = data.get("employee_id", schedule.employee_id)
        schedule.restaurant_id = data.get("restaurant_id", schedule.restaurant_id)
        schedule.date = data.get("date", schedule.date)
        schedule.start_time = data.get("start_time", schedule.start_time)
        schedule.end_time = data.get("end_time", schedule.end_time)
        db.session.commit()
        return jsonify({"message": "Schedule updated!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@routes.route("/schedule/<int:id>", methods=["DELETE"])
def delete_schedule(id):
    schedule = Schedule.query.get(id)
    if not schedule:
        return jsonify({"error": "Schedule not found"}), 404
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule deleted!"})


# --- FILTERING LOGIC ---

@routes.route("/schedule/filter", methods=["GET"])
def get_filtered_schedule():
    restaurant_id = request.args.get("restaurant_id")
    date = request.args.get("date")
    min_duration = request.args.get("min_duration", type=float)

    query = Schedule.query

    if restaurant_id:
        query = query.filter(Schedule.restaurant_id == restaurant_id)
    if date:
        query = query.filter(Schedule.date == date)
    if min_duration is not None:
        query = query.filter(Schedule.duration >= min_duration)

    results = query.all()
    return jsonify([{
        "id": s.id,
        "employee_id": s.employee_id,
        "restaurant_id": s.restaurant_id,
        "date": s.date,
        "start_time": s.start_time,
        "end_time": s.end_time
    } for s in results])

@routes.route("/schedule", methods=["POST"])
def create_schedule():
    data = request.json
    schedule = Schedule(
        employee_id=data["employee_id"],
        restaurant_id=data["restaurant_id"],
        date=data["date"],
        start_time=data["start_time"],
        end_time=data["end_time"]
    )
    schedule.calculate_duration()
    db.session.add(schedule)
    db.session.commit()
    return jsonify({"message": "Schedule added"}), 201