function FeatureApi(query, querystring) {
    this.query = query
    this.querystring = querystring

    // pagination
    this.pagination = () => {
        const limit = this.querystring.limit * 1 || 10
        const skip = this.querystring.limit * (this.querystring.page - 1)
        this.query = this.query.limit(limit).skip(skip)

        return this
    }

    // sort
    this.sorting = () => {
        const sort = this.querystring.sort || 'createdAt'
        this.query = this.query.sort(sort)

        return this
    }

    // search
    // filter
}

module.exports = FeatureApi
