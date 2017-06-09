typedef struct {
  double x;
  double y;
} Point;

class Ball {
  protected:
    Point position;
    Point direction;
  public:
    void setPosition(double x, double y) {
        this->position.x = x;
        this->position.y = y;
    }
    void setDirection(double x, double y) {
        this->direction.x = x;
        this->direction.y = y;
    }
    double getX() {
        return this->position.x;
    }
    double getY() {
        return this->position.y;
    }
    double getDirectionX() {
        return this->direction.x;
    }
    double getDirectionY() {
        return this->direction.y;
    }
    void invertX() {
        this->direction.x = -this->direction.x;
    }
    void invertY() {
        this->direction.y = -this->direction.y;
    }
};