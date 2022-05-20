function FeatureApi(query, querystring) {
    this.query = query
    this.querystring = querystring

    // pagination
    this.pagination = () => {
        const limit = this.querystring.limit * 1 || 10
        const skip = this.querystring.limit * (this.querystring.page - 1) || 0
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
    this.search = () => {
        if (this.querystring.search) {
            this.query = this.query.find({ $text: { $search: this.querystring.search } })
            return this
        }

        return this
    }

    // filter
    this.filtering = () => {
        const queryObj = { ...this.querystring }
        // delete [page, search, sort, limit]
        const containsObj = ['limit', 'page', 'sort', 'search']
        for (const query of containsObj) {
            delete queryObj[query]
        }

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match)

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
}

module.exports = FeatureApi
