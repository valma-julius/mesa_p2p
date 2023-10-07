# frozen_string_literal: true

class AddUsersIcesTable < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE TABLE "users_ice_candidates" (
        "id" BIGSERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL, 
        "ice" VARCHAR (255) NULL,
        "created_at" TIMESTAMP(6) NOT NULL,
        "updated_at" TIMESTAMP(6) NOT NULL
      );
    SQL

    execute <<-SQL
      CREATE INDEX "index_users_ice_candidates_on_user_id" ON "users_ice_candidates" ("user_id");
    SQL
  end

  def down
    execute <<-SQL
      DROP INDEX "index_users_ice_candidates_on_user_id";
    SQL

    execute <<-SQL
      DROP TABLE "users_ice_candidates";
    SQL
  end
end
